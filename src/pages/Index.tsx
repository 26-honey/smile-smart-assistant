
import React from 'react';
import Header from '@/components/Header';
import Chat from '@/components/Chat';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dental-gray">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="grid md:grid-cols-7 gap-6">
          <div className="md:col-span-5">
            <Chat />
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-dental-dark-blue mb-3">Dental Services</h3>
                <ul className="space-y-2">
                  <li className="text-sm">General Checkups</li>
                  <li className="text-sm">Teeth Cleaning</li>
                  <li className="text-sm">Fillings & Restorations</li>
                  <li className="text-sm">Root Canal Therapy</li>
                  <li className="text-sm">Teeth Whitening</li>
                  <li className="text-sm">Dental Implants</li>
                  <li className="text-sm">Orthodontics</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-dental-dark-blue mb-3">Contact Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                  <div className="pt-2">
                    <strong>Emergency:</strong> 24/7 Support
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-dental-dark-blue mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-dental-blue hover:underline cursor-pointer">About Our Practice</li>
                  <li className="text-sm text-dental-blue hover:underline cursor-pointer">Meet Our Dentists</li>
                  <li className="text-sm text-dental-blue hover:underline cursor-pointer">Insurance Information</li>
                  <li className="text-sm text-dental-blue hover:underline cursor-pointer">Patient Forms</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
