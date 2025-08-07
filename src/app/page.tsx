import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
   <div className="p-5">
    <div className="w-100 flex justify-end">
      <ThemeToggle/>
    </div>
    <h1 className="font-barlow text-5xl">welcome to course</h1>
    <Button variant="default">Click </Button>
   </div>
  );
}
