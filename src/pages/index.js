import { Button, Flex, Input, Text, Theme } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Home() {
  const stages = {
    BEFORE_REGISTRATION: 0,
    AFTER_FORM_SUBMITTED: 1,
    VERIFIED_BEFORE_UNLOCK: 2,
    VERIFIED_AFTER_UNLOCK: 3,
  };

  const [stage, setStage] = useState(-1);

  // const unlockTime = 1743675267604;
  const unlockTime = 1743685267604;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params !== null) {
      if (params.has("token")) {
        console.log(params.get("token"));
        if (Date.now() < unlockTime) {
          setStage(stages.VERIFIED_BEFORE_UNLOCK);
        } else {
          setStage(stages.VERIFIED_AFTER_UNLOCK);
        }
      } else {
        setStage(stages.BEFORE_REGISTRATION);
      }
    }
    console.log({ params });
  }, []);

  const [eventID, setEventID] = useState("");

  return (
    <Theme appearance="light">
      <Flex padding={"20px"} flexDirection={"column"} minH={"100vh"}>
        <Text>Enter Event ID to go to event signup</Text>
        <Input
          value={eventID}
          onChange={(e) => {
            setEventID(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            window.open(
              `${window.location.origin}/${eventID}`,
              "_blank",
              "noopener,noreferrer"
            );
          }}
        />
      </Flex>
    </Theme>
  );
}
