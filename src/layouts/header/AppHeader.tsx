import { useState, useEffect } from "react";
import { SidebarTrigger } from "#components/ui/sidebar";
import { Button } from "#components/ui/button";
import { Separator } from "#components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Bell,
  CalendarDays,
  Clock,
  ChevronDown,
  Home,
  BookOpen,
  FileText,
} from "lucide-react";
import { cn } from "#lib/utils";

interface RouteNode {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: RouteNode[];
}

interface AppHeaderProps {
  className?: string;
  routeTree?: RouteNode[];
  currentPath?: string[];
}

const defaultRouteTree: RouteNode[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-3.5 w-3.5" />,
  },
  {
    label: "Courses",
    icon: <BookOpen className="h-3.5 w-3.5" />,
    children: [
      { label: "All Courses", href: "/courses" },
      { label: "My Enrollments", href: "/courses/enrolled" },
      { label: "Bookmarks", href: "/courses/bookmarks" },
    ],
  },
  {
    label: "Assignments",
    icon: <FileText className="h-3.5 w-3.5" />,
    children: [
      { label: "Pending", href: "/assignments/pending" },
      { label: "Submitted", href: "/assignments/submitted" },
      { label: "Graded", href: "/assignments/graded" },
    ],
  },
];

const AppHeader = ({
  className,
  routeTree = defaultRouteTree,
  currentPath = ["Courses", "All Courses"],
}: AppHeaderProps) => {

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const findRouteNode = (label: string, tree: RouteNode[] = routeTree): RouteNode | undefined => {
    for (const node of tree) {
      if (node.label === label) return node;
      if (node.children) {
        const found = findRouteNode(label, node.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const renderBreadcrumbItem = (segment: string, _: number, isLast: boolean) => {
    const node = findRouteNode(segment);
    const hasChildren = node?.children && node.children.length > 0;

    if (isLast) {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage className="text-sm font-semibold text-foreground">
            {segment}
          </BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    if (hasChildren) {
      return (
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <BreadcrumbLink className="flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {node?.icon && <span className="mr-0.5">{node.icon}</span>}
                {segment}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </BreadcrumbLink>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-[180px] rounded-lg p-1.5"
            >
              {node.children?.map((child) => (
                <DropdownMenuItem
                  key={child.label}
                  className="cursor-pointer gap-2 rounded-md px-2.5 py-2 text-sm"
                >
                  {child.icon}
                  {child.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      );
    }

    return (
      <BreadcrumbItem>
        <BreadcrumbLink
          href={node?.href || "#"}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {node?.icon && <span className="mr-0.5">{node.icon}</span>}
          {segment}
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl transition-all",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" />

        <Separator orientation="vertical" className="h-6" />

        {/* Route Breadcrumb Tree */}
        <Breadcrumb>
          <BreadcrumbList className="flex items-center gap-1.5">
            {currentPath.map((segment, index) => (
              <div key={segment} className="flex items-center gap-1.5">
                {index > 0 && (
                  <BreadcrumbSeparator className="text-muted-foreground/40" />
                )}
                {renderBreadcrumbItem(segment, index, index === currentPath.length - 1)}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center Section — Search */}
      <div className="hidden flex-1 items-center justify-center px-8 md:flex">
        <Button
          variant="outline"
          className="relative h-9 w-full max-w-md justify-start rounded-lg bg-muted/50 text-sm font-normal text-muted-foreground shadow-none hover:bg-muted"
        >
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          Search courses, lessons...
          <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Date & Time */}
        <div className="hidden items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 sm:flex">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{formattedDate}</span>
          </div>
          <Separator orientation="vertical" className="h-3.5" />
          <div className="flex items-center gap-1.5 text-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="min-w-[52px] text-xs font-semibold tabular-nums">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Mobile Time Only */}
        <div className="flex items-center gap-1.5 rounded-lg bg-muted/30 px-2.5 py-1.5 sm:hidden">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold tabular-nums">
            {formattedTime}
          </span>
        </div>

        <Separator orientation="vertical" className="mx-1 hidden h-6 sm:block" />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;