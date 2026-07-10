import { redirect } from "next/navigation";

export default function PlaygroundRootPage() {
  // Redirect to the hub since there is no generic playground page
  redirect("/hub");
}
