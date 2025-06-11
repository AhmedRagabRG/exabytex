import { Hero } from "@/components/sections/hero"
import { ModernServices } from "@/components/sections/modern-services"
// import { Portfolio } from "@/components/sections/portfolio"
import { ProcessSteps } from "@/components/sections/process-steps"
import { TechStack } from "@/components/sections/tech-stack"
// import { ClientResults } from "@/components/sections/client-results"
import { Blog } from "@/components/sections/blog"
// import { Contact } from "@/components/sections/contact"

export default function HomePage() {
  return (
    <>
      <Hero />
      <ModernServices />
      {/* <Portfolio /> */}
      <ProcessSteps />
      <TechStack />
      {/* <ClientResults /> */}
      <Blog />
      {/* <Contact /> */}
    </>
  )
}
