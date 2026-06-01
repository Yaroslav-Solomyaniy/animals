import AnimalWaitCatalog from '@/components/AnimalWaitCatalog'
import CityProgram from '@/components/CityProgram'
import TrustValues from '@/components/TrustValues'
import JoinMission from "@/components/JoinMission";
import HelpUs from "@/components/HelpUs";
import Welcome from "@/components/Welcome";
import {getPublicAnimals} from '@/lib/animals'


export default async function HomePage() {
    const {animals} = await getPublicAnimals({from: 0, to:10000}, 6);

    return (
        <main className="min-h-screen">
            {/*<HomeHeroSlider/>*/}
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
