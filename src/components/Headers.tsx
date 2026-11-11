import AuthButton from "@/features/auth";
import Settings from "@/features/settings";

export default function Headers() {
  return (
    <div className="w-lg">
      <div>
        <h1 className="text-foreground">FokusVan</h1>
      </div>
      <div className="flex justify-between items-center">
        <Settings />
        <AuthButton />
      </div>
    </div>
  );
}
