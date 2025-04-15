import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { DateRangeOption } from "@/lib/dateUtils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeOption>("7d");

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Pass date range to children with React.cloneElement
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { dateRange, setDateRange } as any);
    }
    return child;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleSidebar={toggleSidebar} 
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isVisible={sidebarVisible} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
}
