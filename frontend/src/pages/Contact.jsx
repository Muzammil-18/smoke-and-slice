import React, { useState } from 'react'
import { Phone, MapPin, Mail, Clock, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending an email/message to the server
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSending(false);
      toast.success('Your message has been sent successfully!');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-wide">Get In Touch</h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Have a question about our slow-smoking methods, catering services, or private events? Drop us a line below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">Location</h3>
              <p className="text-neutral-450 text-xs sm:text-sm leading-normal">
                100 Smokehouse Way<br />Austin, TX 78701
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">Phone</h3>
              <p className="text-neutral-455 text-xs sm:text-sm leading-normal">
                +1 (555) 0199
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">Email</h3>
              <p className="text-neutral-450 text-xs sm:text-sm leading-normal text-primary">
                info@smokeslice.com
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">Opening Hours</h3>
              <p className="text-neutral-455 text-xs sm:text-sm leading-normal">
                Mon - Sat: 11:00 AM - 10:00 PM<br />
                Sunday: 12:00 PM - 9:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 sm:p-8 space-y-6 lg:col-span-2 shadow-xl">
          <h2 className="text-xl font-bold text-white tracking-wide">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows="5"
                className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white text-sm resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-primary/20"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;