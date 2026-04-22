import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'
import { useEffect, useRef } from 'react'

type GL = Renderer['gl']
type GalleryItem = { image: string; text: string }

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function debounce<T extends (...args: Array<any>) => void>(
  fn: T,
  wait: number,
) {
  let timeout: number

  return function (this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => fn.apply(this, args), wait)
  }
}

function getFontSize(font: string) {
  return parseInt(font.match(/(\d+)px/)?.[1] ?? '30', 10)
}

function createTextTexture(gl: GL, text: string, font: string, color: string) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2d context')

  const lines = text.split('\n')
  const fontSize = getFontSize(font)
  const lineHeight = fontSize * 1.25

  ctx.font = font
  canvas.width =
    Math.ceil(Math.max(...lines.map((line) => ctx.measureText(line).width))) +
    28
  canvas.height = Math.ceil(lines.length * lineHeight) + 24

  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  lines.forEach((line, index) => {
    const y =
      canvas.height / 2 -
      ((lines.length - 1) * lineHeight) / 2 +
      index * lineHeight
    ctx.fillText(line, canvas.width / 2, y)
  })

  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas

  return { texture, width: canvas.width, height: canvas.height }
}

class Title {
  mesh: Mesh

  constructor({
    gl,
    plane,
    text,
    color,
    font,
  }: {
    gl: GL
    plane: Mesh
    text: string
    color: string
    font: string
  }) {
    const { texture, width, height } = createTextTexture(gl, text, font, color)
    const geometry = new Plane(gl)
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    })

    this.mesh = new Mesh(gl, { geometry, program })

    const aspect = width / height
    const textHeight = plane.scale.y * 0.18
    this.mesh.scale.set(textHeight * aspect, textHeight, 1)
    this.mesh.position.y = -plane.scale.y * 0.5 - textHeight * 0.65
    this.mesh.setParent(plane)
  }
}

class Media {
  extra = 0
  plane!: Mesh
  program!: Program
  width = 0
  widthTotal = 0
  x = 0
  isBefore = false
  isAfter = false

  constructor(
    private config: {
      gl: GL
      geometry: Plane
      scene: Transform
      image: string
      text: string
      index: number
      length: number
      screen: { width: number; height: number }
      viewport: { width: number; height: number }
      bend: number
      textColor: string
      borderRadius: number
      font: string
    },
  ) {
    this.createShader()
    this.createMesh()
    this.onResize()
    new Title({
      gl: this.config.gl,
      plane: this.plane,
      text: this.config.text,
      color: this.config.textColor,
      font: this.config.font,
    })
  }

  createShader() {
    const texture = new Texture(this.config.gl, { generateMipmaps: true })

    this.program = new Program(this.config.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.config.borderRadius },
      },
      transparent: true,
    })

    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = this.config.image
    image.onload = () => {
      texture.image = image
      this.program.uniforms.uImageSizes.value = [
        image.naturalWidth,
        image.naturalHeight,
      ]
    }
  }

  createMesh() {
    this.plane = new Mesh(this.config.gl, {
      geometry: this.config.geometry,
      program: this.program,
    })
    this.plane.setParent(this.config.scene)
  }

  onResize({
    screen,
    viewport,
  }: {
    screen?: { width: number; height: number }
    viewport?: { width: number; height: number }
  } = {}) {
    if (screen) this.config.screen = screen
    if (viewport) this.config.viewport = viewport

    const scale = this.config.screen.height / 1500
    this.plane.scale.y =
      (this.config.viewport.height * (900 * scale)) / this.config.screen.height
    this.plane.scale.x =
      (this.config.viewport.width * (700 * scale)) / this.config.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ]

    const padding = 2
    this.width = this.plane.scale.x + padding
    this.widthTotal = this.width * this.config.length
    this.x = this.width * this.config.index
  }

  update(
    scroll: { current: number; last: number },
    direction: 'left' | 'right',
  ) {
    this.plane.position.x = this.x - scroll.current - this.extra

    const x = this.plane.position.x
    const halfViewport = this.config.viewport.width / 2

    if (this.config.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const bend = Math.abs(this.config.bend)
      const radius = (halfViewport * halfViewport + bend * bend) / (2 * bend)
      const effectiveX = Math.min(Math.abs(x), halfViewport)
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX)

      this.plane.position.y = this.config.bend > 0 ? -arc : arc
      this.plane.rotation.z =
        (this.config.bend > 0 ? -1 : 1) *
        Math.sign(x) *
        Math.asin(effectiveX / radius)
    }

    const speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = speed

    const planeOffset = this.plane.scale.x / 2
    this.isBefore = this.plane.position.x + planeOffset < -halfViewport
    this.isAfter = this.plane.position.x - planeOffset > halfViewport

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }

    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }
}

class CircularGalleryApp {
  renderer: Renderer
  gl: GL
  camera: Camera
  scene = new Transform()
  geometry: Plane
  medias: Array<Media> = []
  raf = 0
  isDown = false
  start = 0
  screen = { width: 1, height: 1 }
  viewport = { width: 1, height: 1 }
  scroll = { ease: 0.05, current: 0, target: 0, last: 0, position: 0 }
  onCheckDebounce: () => void

  constructor(
    private container: HTMLElement,
    private config: {
      items: Array<GalleryItem>
      bend: number
      textColor: string
      borderRadius: number
      font: string
      scrollSpeed: number
      scrollEase: number
    },
  ) {
    this.scroll.ease = config.scrollEase
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200)

    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas as HTMLCanvasElement)

    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20

    this.geometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    })

    this.onResize()
    this.createMedias()
    this.addEventListeners()
    this.update()
  }

  createMedias() {
    const medias = this.config.items.concat(this.config.items)
    this.medias = medias.map(
      (item, index) =>
        new Media({
          gl: this.gl,
          geometry: this.geometry,
          scene: this.scene,
          image: item.image,
          text: item.text,
          index,
          length: medias.length,
          screen: this.screen,
          viewport: this.viewport,
          bend: this.config.bend,
          textColor: this.config.textColor,
          borderRadius: this.config.borderRadius,
          font: this.config.font,
        }),
    )
  }

  onResize = () => {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({ aspect: this.screen.width / this.screen.height })

    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    this.viewport = { width: height * this.camera.aspect, height }

    this.medias.forEach((media) =>
      media.onResize({ screen: this.screen, viewport: this.viewport }),
    )
  }

  onCheck() {
    if (!this.medias[0]) return

    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }

  onWheel = (event: Event) => {
    const wheel = event as WheelEvent
    const delta =
      wheel.deltaY || (wheel as any).wheelDelta || (wheel as any).detail
    this.scroll.target +=
      (delta > 0 ? this.config.scrollSpeed : -this.config.scrollSpeed) * 0.2
    this.onCheckDebounce()
  }

  onTouchDown = (event: MouseEvent | TouchEvent) => {
    this.isDown = true
    this.scroll.position = this.scroll.current
    this.start = 'touches' in event ? event.touches[0].clientX : event.clientX
  }

  onTouchMove = (event: MouseEvent | TouchEvent) => {
    if (!this.isDown) return

    const x = 'touches' in event ? event.touches[0].clientX : event.clientX
    const distance = (this.start - x) * (this.config.scrollSpeed * 0.025)
    this.scroll.target = this.scroll.position + distance
  }

  onTouchUp = () => {
    this.isDown = false
    this.onCheck()
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('mousewheel', this.onWheel)
    window.addEventListener('wheel', this.onWheel)
    this.container.addEventListener('mousedown', this.onTouchDown)
    this.container.addEventListener('mousemove', this.onTouchMove)
    window.addEventListener('mouseup', this.onTouchUp)
    this.container.addEventListener('touchstart', this.onTouchDown)
    this.container.addEventListener('touchmove', this.onTouchMove)
    window.addEventListener('touchend', this.onTouchUp)
  }

  update = () => {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease,
    )
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left'

    this.medias.forEach((media) => media.update(this.scroll, direction))
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = window.requestAnimationFrame(this.update)
  }

  destroy() {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('mousewheel', this.onWheel)
    window.removeEventListener('wheel', this.onWheel)
    this.container.removeEventListener('mousedown', this.onTouchDown)
    this.container.removeEventListener('mousemove', this.onTouchMove)
    window.removeEventListener('mouseup', this.onTouchUp)
    this.container.removeEventListener('touchstart', this.onTouchDown)
    this.container.removeEventListener('touchmove', this.onTouchMove)
    window.removeEventListener('touchend', this.onTouchUp)
    this.gl.canvas.parentNode?.removeChild(this.gl.canvas as HTMLCanvasElement)
  }
}

export interface CircularGalleryProps {
  items: Array<GalleryItem>
  bend?: number
  textColor?: string
  borderRadius?: number
  font?: string
  scrollSpeed?: number
  scrollEase?: number
}

export default function CircularGallery({
  items,
  bend = 1,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 26px Manrope',
  scrollSpeed = 2,
  scrollEase = 0.05,
}: CircularGalleryProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined' || !items.length) return

    const app = new CircularGalleryApp(ref.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
    })

    return () => app.destroy()
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase])

  return <div ref={ref} className="h-full w-full cursor-grab overflow-hidden" />
}
