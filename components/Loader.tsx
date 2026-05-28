import { InfinitySpin } from 'react-loader-spinner'

export default function Loader() {
  return (
    <div
      data-loader-screen
      className="loader-screen"
    >
      <div className="flex origin-center scale-[1.05] items-center justify-center sm:scale-[1.4] lg:scale-[1.7]">
        <InfinitySpin visible width={200} color="#f27438" ariaLabel="Loading" />
      </div>
    </div>
  )
}
