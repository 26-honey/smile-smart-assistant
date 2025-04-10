
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import FloatingChatbot from '@/components/FloatingChatbot';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dental-gray">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-dental-dark-blue mb-3">Welcome to SmileSmart Assistant</h3>
              <p className="text-sm">Our virtual dental assistant is here to help you with all your dental care needs. Use the chat button in the bottom right to ask questions or schedule an appointment.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-dental-dark-blue mb-3">Dental Services</h3>
              <ul className="space-y-2">
                <li className="text-sm">General Checkups</li>
                <li className="text-sm">Teeth Cleaning</li>
                <li className="text-sm">Fillings & Restorations</li>
                <li className="text-sm">Root Canal Therapy</li>
                <li className="text-sm">Teeth Whitening</li>
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
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-dental-dark-blue mb-3">Patient Testimonials</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-dental-teal pl-3">
                  <p className="text-sm italic">"The SmileSmart team is amazing! My experience was comfortable and the results were fantastic."</p>
                  <p className="text-xs mt-1 text-muted-foreground">- Sarah Johnson</p>
                </div>
                <div className="border-l-2 border-dental-teal pl-3">
                  <p className="text-sm italic">"I was anxious about my root canal, but Dr. Miller made it painless and easy."</p>
                  <p className="text-xs mt-1 text-muted-foreground">- Michael Thomas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-dental-dark-blue mb-3">Dental Health Tips</h3>
              <ul className="space-y-2">
                <li className="text-sm">Brush twice daily for two minutes</li>
                <li className="text-sm">Floss at least once a day</li>
                <li className="text-sm">Replace your toothbrush every 3-4 months</li>
                <li className="text-sm">Schedule regular dental checkups</li>
                <li className="text-sm">Limit sugary foods and beverages</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-dental-dark-blue mb-3">Insurance Information</h3>
              <p className="text-sm mb-2">We accept most major dental insurance providers. Please contact us for specific coverage information.</p>
              <p className="text-sm">For patients without insurance, we offer affordable payment plans and discounts on preventive care.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default Home;
