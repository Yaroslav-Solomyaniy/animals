import AnimalWaitCatalog from '@/components/AnimalWaitCatalog'
import CityProgram from '@/components/CityProgram'
import TrustValues from '@/components/TrustValues'
import JoinMission from "@/components/JoinMission";
import HelpUs from "@/components/HelpUs";
import Welcome from "@/components/Welcome";
import HomeHeroSlider from '@/components/HomeHeroSlider'
import {getPublicAnimals} from '@/lib/animals'


export default async function HomePage() {
    const {animals} = await getPublicAnimals({from: 0, to:10000}, 6);

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,#f6f7f4_0%,#fbfaf7_38%,#f7faf6_68%,#fffaf6_100%)]">
            <HomeHeroSlider/>
            <Welcome/>
            <CityProgram/>
            <AnimalWaitCatalog animals={animals}/>

            {/*<QuickContactCTA/>*/}
            <TrustValues/>
            <JoinMission/>
            <HelpUs/>
        </main>
    )
}
