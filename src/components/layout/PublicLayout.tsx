import { PublicHeader } from "#components/headers/PublicHeader";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  ); 
}