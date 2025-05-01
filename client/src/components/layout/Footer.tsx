import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-darkBg/60 border-t border-[hsl(var(--solana-purple))/30] py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(var(--solana-purple))] to-[hsl(var(--solana-teal))] flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="ml-2 text-lg font-bold text-white">Nym<span className="text-solana-teal">SOL</span></span>
            </div>
            <p className="text-gray-400 text-sm">The premier interface for managing your Solana Name Service domains.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-[hsl(var(--solana-teal))] transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[hsl(var(--solana-teal))] transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[hsl(var(--solana-teal))] transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[hsl(var(--solana-teal))] transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex items-center space-x-2 mb-4">
              <a href="https://x.com/nym_sol" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[hsl(var(--solana-teal))] transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="font-medium">Follow us on X</span>
              </a>
            </div>
            <p className="text-gray-400 text-sm mb-1">@nym_sol</p>
            <p className="text-gray-400 text-sm">The interface layer for .sol domains</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 NymSOL. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-[hsl(var(--solana-teal))] text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-[hsl(var(--solana-teal))] text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[hsl(var(--solana-teal))] text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
