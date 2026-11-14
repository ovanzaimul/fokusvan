import AuthButton from "@/features/auth";
import Settings from "@/features/settings";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export default function Headers() {
  return (
    <Card className="w-full md:w-md max-w-lg p-2 gap-2">
      <CardHeader className="px-2.5">
        <CardTitle className="normal-case">FokusVan</CardTitle>
      </CardHeader>
      <Separator />
      <div className="flex justify-between items-center">
        <Settings />
        <AuthButton />
      </div>
    </Card>
  );
}
