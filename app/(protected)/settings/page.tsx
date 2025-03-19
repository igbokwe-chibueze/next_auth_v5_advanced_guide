import {auth, signOut} from "@/auth";

const page = async () => {
    const session = await auth();
  return (
    <div>
        {JSON.stringify(session)}

        <form action={async() => {
            "use server";
            await signOut();
            //TODO : WHEN i signOut it redirects to login Page but the url remains at /settings
        }}>
            <button type="submit">
                Logout
            </button>
        </form>
    </div>
  )
}

export default page