import Welcome from '@/components/Welcome'
import AnimalWaitCatalog from '@/components/AnimalWaitCatalog'
import CityProgram from '@/components/CityProgram'
import TrustValues from '@/components/TrustValues'
import QuickContactCTA from "@/components/QuickContactCTA";
import JoinMission from "@/components/JoinMission";
import HelpUs from "@/components/HelpUs";
import { getPublicAnimals } from '@/lib/animals'



export default async function HomePage() {
    const animals = await getPublicAnimals(8)

    return (
        <main className="min-h-screen">
            <Welcome/>
            <CityProgram/>
            <AnimalWaitCatalog animals={animals}/>
            <QuickContactCTA/>
            <TrustValues/>
            <JoinMission/>
            <HelpUs/>
        </main>
    )
}
