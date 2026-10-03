import { notFound } from "next/navigation";

/** Unknown paths under a valid locale render the localized 404. */
export default function CatchAllPage() {
  notFound();
}
