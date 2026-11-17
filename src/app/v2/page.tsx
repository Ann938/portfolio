import Smooth from "@/components/Smooth";
import Switcher from "@/components/Switcher";
import V2 from "@/components/V2";

export default function Page() {
  return (
    <>
      <Smooth />
      <V2 />
      <Switcher cur={2} />
    </>
  );
}
