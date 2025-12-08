import React from 'react'

const CarbonContributionPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-dark-navy">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-light leading-tight mb-8">
              At <span className="text-light-teal font-normal">Thea's Games</span>, we contribute 1% of our revenue to carbon removal
            </h1>
            <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-500 mb-4">
              <img 
                src="/assets/carbon/stripe-climate-logo.svg" 
                alt="Stripe Climate" 
                className="w-5 h-5"
              />
              <span>Stripe Climate member</span>
            </div>
          </div>
        </div>
      </section>

      {/* Angled Video/Image Section */}
      <div className="relative w-full overflow-hidden" style={{ height: '60vh', minHeight: '400px' }}>
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("/assets/carbon/background.jpg")',
            clipPath: 'polygon(0 0, 100% 10vw, 100% 100%, 0% 100%)', // Approximate slant
            zIndex: 0
          }}
        />
        {/* Overlay Text - Positioned to overlap the image/white boundary if needed, or just below */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-white -mt-20 pt-20 pb-16">
         {/* Introduction */}
        <section className="max-w-4xl mx-auto px-4 mb-24 text-center md:text-left">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-800">
              Removing CO₂ from the atmosphere is critical to counteract climate change, but the technology is currently lagging behind. A fraction of every purchase from <strong>Thea's Games</strong> helps new carbon removal technologies scale.
            </p>
        </section>

        {/* Why We Contribute */}
        <section className="bg-ice-aqua/30 py-16 px-4 md:px-8 rounded-3xl mx-4 md:mx-auto max-w-6xl mb-24">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <h2 className="text-sm font-bold tracking-widest uppercase text-light-teal mb-2">Why we contribute</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-xl md:text-3xl font-light text-dark-navy">
                At Thea's Games, we believe businesses can play a critically important role in helping fight climate change which will also help the oceans. We’re proud to fund next-generation carbon removal.
              </p>
            </div>
          </div>
        </section>

        {/* Our Partners */}
        <section className="max-w-6xl mx-auto px-4 mb-24">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h2 className="text-sm font-bold tracking-widest uppercase text-light-teal mb-4">Our partners</h2>
              <p className="text-xl text-gray-800 mb-6">
                Thea's Games is part of Stripe Climate, a coalition of businesses accelerating carbon removal
              </p>
              <div className="flex gap-12 mb-8">
                <div>
                  <div className="text-3xl font-light mb-1">25,000+</div>
                  <div className="text-sm text-gray-500">businesses</div>
                </div>
                <div>
                  <div className="text-3xl font-light mb-1">39</div>
                  <div className="text-sm text-gray-500">countries</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-8">
               <p className="text-lg text-gray-600 leading-relaxed mb-4">
                No company can stop climate change by itself. <a href="https://stripe.com/climate" target="_blank" rel="noopener noreferrer" className="text-medium-purple hover:underline">Stripe Climate</a> aggregates funds from forward-thinking businesses around the world to increase demand for carbon removal. Stripe Climate works with <a href="https://frontierclimate.com/" target="_blank" rel="noopener noreferrer" className="text-medium-purple hover:underline">Frontier</a>, Stripe's in-house team of science and commercial experts, to purchase permanent carbon removal.
               </p>
            </div>
          </div>
        </section>

        {/* Select Projects */}
        <section className="max-w-6xl mx-auto px-4 mb-24">
          <div className="mb-12">
            <h2 className="text-sm font-bold tracking-widest uppercase text-light-teal mb-4">Select projects</h2>
            <p className="text-xl text-gray-800 max-w-2xl mb-4">
              We support a portfolio of emerging technologies that remove CO₂ from the atmosphere
            </p>
             <p className="text-gray-600 max-w-2xl">
              Stripe Climate works with a multidisciplinary group of scientific experts to find and evaluate the most promising carbon removal technologies. Below are two examples from our broader portfolio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Project 1: Climeworks */}
            <article>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                   <source src="/assets/carbon/climeworks.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="border-t border-gray-200 pt-6">
                 <img src="/assets/carbon/climeworks-logo.svg" alt="Climeworks" className="h-8 mb-4" />
                 <p className="text-gray-600 mb-4">
                   Climeworks uses renewable geothermal energy and waste heat to capture CO₂ directly from the air, concentrate it, and permanently sequester it underground in basaltic rock formations with Carbfix. Climeworks will remove 322 tons of CO₂ on behalf of Stripe Climate businesses.
                 </p>
              </div>
            </article>

            {/* Project 2: Charm Industrial */}
            <article>
               <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                   <source src="/assets/carbon/charm.mp4" type="video/mp4" />
                </video>
              </div>
               <div className="border-t border-gray-200 pt-6">
                 <img src="/assets/carbon/charm-logo.svg" alt="Charm Industrial" className="h-8 mb-4" />
                 <p className="text-gray-600 mb-4">
                   Charm Industrial has created a novel carbon removal pathway that converts biomass into bio-oil and then injects it deep underground for permanent geologic storage. Stripe Climate was Charm’s first customer. In 2021, Charm removed 416 tons of CO₂ on behalf of Stripe Climate businesses.
                 </p>
              </div>
            </article>
          </div>
        </section>

        {/* Why It Works (Chart) */}
        <section className="max-w-6xl mx-auto px-4 mb-24">
           <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
               <h2 className="text-sm font-bold tracking-widest uppercase text-light-teal mb-4">Why it works</h2>
               <p className="text-xl text-gray-800 mb-4">
                  Early customers can help new technologies get down the cost curve and scale up
               </p>
               <p className="text-gray-600">
                  Most new technology is expensive at first. Early adopters such as <strong>Thea's Games</strong> help promising new carbon removal technologies lower their costs and scale up quickly.
               </p>
            </div>
            <div className="md:col-span-8">
               <div className="relative bg-gray-50 rounded-xl p-8 aspect-[16/9] flex items-end justify-center">
                 <img 
                    src="/assets/carbon/background.jpg" 
                    alt="Chart Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-10 rounded-xl"
                 />
                 <div className="relative z-10 text-center text-gray-500 italic">
                    (Cost curve chart: Carbon removal follows Solar, Hard Drives, DNA Sequencing trajectory)
                 </div>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CarbonContributionPage
