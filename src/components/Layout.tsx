
import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-sm text-solana-light-gray">
        <div className="container mx-auto">
          <p>Built on the Solana blockchain. Use devnet for testing.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
