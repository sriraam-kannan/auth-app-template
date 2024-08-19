import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import neoAxios from "../lib/neoAxios";

export default function Dashboard() {
  const user = useCurrentUser();
  const loginId = user?.currentUser?.signInDetails?.loginId;

  const onClickProfile = async () => {
    try {
      const userApiData = await neoAxios.post("/getUserProfile");
      console.log(userApiData.data);
    } catch (error) {
      console.error("API failed", error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Welcome, {loginId}
        </h1>
        <>
          <div>
            <Button onClick={onClickProfile}>Profile</Button>
          </div>
        </>
      </div>
    </main>
  );
}
