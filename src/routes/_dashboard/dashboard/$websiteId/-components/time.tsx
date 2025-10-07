export function Time({ selectedTimeZone }: { selectedTimeZone: string }) {
  let timeStr = "";

  try {
    const now = new Date();

    timeStr = selectedTimeZone
      ? now.toLocaleTimeString("en-US", {
          timeZone: selectedTimeZone,
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "";
  } catch (error) {
    console.log(error);

    console.log({ selectedTimeZone });
  }

  return (
    <span className="text-gray-400 text-nowrap ">where time is {timeStr}</span>
  );
}
