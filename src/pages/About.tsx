import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Users, Building, Target, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Protecting Businesses from AI-Powered Threats</h1>
                <p className="text-lg text-muted-foreground">
                  Founded in 2023, AI Shield Alert was created with a mission to protect organizations from the 
                  rising wave of AI-generated phishing attempts and social engineering attacks.
                </p>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="bg-primary/10 p-8 rounded-full">
                  <Shield className="h-32 w-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're dedicated to staying one step ahead of cybercriminals by leveraging cutting-edge AI detection technology to identify and neutralize threats before they reach your team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Proactive Protection</h3>
                <p className="text-muted-foreground">We don't wait for attacks to happen. Our technology actively scans for threats in real-time.</p>
              </div>

              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Industry Leadership</h3>
                <p className="text-muted-foreground">We're recognized leaders in AI-powered security, with multiple industry awards for innovation.</p>
              </div>

              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
                <p className="text-muted-foreground">Our clients' security is our top priority. We work closely with each organization to tailor protection.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These core principles guide everything we do at AI Shield Alert.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-primary/10 rounded-full shrink-0">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                  <p className="text-muted-foreground">We believe in transparent operations and honest communication with our clients about the evolving threat landscape.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-primary/10 rounded-full shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Security First</h3>
                  <p className="text-muted-foreground">We never compromise on security. Our solutions are built with multiple layers of protection to ensure maximum safety.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-primary/10 rounded-full shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">We're constantly researching and developing new technologies to stay ahead of evolving AI-powered threats.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-primary/10 rounded-full shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
                  <p className="text-muted-foreground">We believe in enabling organizations with both technology and knowledge to protect themselves effectively.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
