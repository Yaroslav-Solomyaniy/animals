import Welcome from '@/components/Welcome'
import AnimalWaitCatalog from '@/components/AnimalWaitCatalog'
import CityProgram from '@/components/CityProgram'
import TrustValues from '@/components/TrustValues'
import QuickContactCTA from "@/components/QuickContactCTA";
import JoinMission from "@/components/JoinMission";
import HelpUs from "@/components/HelpUs";



export default function HomePage() {
    return (
        <main className="min-h-screen">
            <Welcome/>
            <CityProgram/>
            <AnimalWaitCatalog/>
            <QuickContactCTA/>
            <TrustValues/>
            <JoinMission/>
            <HelpUs/>
        </main>
    )
}
