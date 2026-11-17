import Smooth from "@/components/Smooth";
import Switcher from "@/components/Switcher";
import V1 from "@/components/V1";

export default function Page() {
  return (
    <>
      <Smooth />
      <V1 />
      <Switcher cur={1} />
    </>
  );
}
