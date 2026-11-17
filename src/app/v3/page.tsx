import Smooth from "@/components/Smooth";
import Switcher from "@/components/Switcher";
import V3 from "@/components/V3";

export default function Page() {
  return (
    <>
      <Smooth />
      <V3 />
      <Switcher cur={3} />
    </>
  );
}
