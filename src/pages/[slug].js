import { isEmail } from "@/utils";
import { Box, Button, Flex, Input, Text, Theme } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const events = {
  "event-ai-workshop-2025": {
    instructions: "These are the instructions for AI Workshop 2025",
    unlockTime: 1743677517000,
    id: "event-ai-workshop-2025",
    title: "Event AI Workshop 25",
  },
  "event-ai-workshop-2026": {
    instructions: "These are the instructions for AI Workshop 2026",
    unlockTime: 1744109310000,
    id: "event-ai-workshop-2026",
    title: "Event AI Workshop 26",
  },
};

const Star = () => <span style={{ color: "#BE0817" }}>*</span>;

export default function Home() {
  const stages = {
    BEFORE_REGISTRATION: 0,
    AFTER_FORM_SUBMITTED: 1,
    VERIFIED_BEFORE_UNLOCK: 2,
    VERIFIED_AFTER_UNLOCK: 3,
    NO_EVENT_EXISTS: 4,
  };

  const [stage, setStage] = useState(-1);

  // const unlockTime = 1743675267604;
  //   const unlockTime = 1743685267604;

  const [event, setEvent] = useState({});

  const [user, setUser] = useState({});

  const init = async () => {
    console.log(window.location);
    const paths = window.location.pathname.split("/");
    console.log(paths);
    if (!(paths.length === 2 && Object.keys(events).includes(paths[1]))) {
      setStage(stages.NO_EVENT_EXISTS);
      return;
    }
    const event = events[paths[1]];
    setEvent(event);
    const params = new URLSearchParams(window.location.search);
    if (params !== null) {
      if (params.has("token")) {
        console.log(params.get("token"));
        const response = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ id: params.get("token"), event: event.id }),
        });
        if (!response.ok) {
          setStage(stages.BEFORE_REGISTRATION);
          toast.error("Something went wrong", {
            position: "bottom-center",
          });
          return;
        }
        const userObj = (await response.json()).obj;

        if (userObj === false) {
          setStage(stages.BEFORE_REGISTRATION);
          toast.error("Invalid Token", {
            position: "bottom-center",
          });
          return;
        }

        setUser(userObj);

        if (Date.now() < event.unlockTime) {
          setStage(stages.VERIFIED_BEFORE_UNLOCK);
          setTimeout(() => {
            location.reload();
          }, event.unlockTime - Date.now());
        } else {
          setStage(stages.VERIFIED_AFTER_UNLOCK);
        }
      } else {
        setStage(stages.BEFORE_REGISTRATION);
      }
    }
    console.log({ params });
  };
  useEffect(() => {
    init();
  }, []);

  const [newID, setNewID] = useState("");

  const censoredEmail = (email) => {
    return `${email.split("@")[0][0]}${new Array(email.split("@")[0].length - 1)
      .fill("*")
      .join("")}@${email.split("@")[1]}`;
  };

  return (
    <Theme appearance="light">
      <Flex padding={"20px"} flexDirection={"column"} minH={"100vh"}>
        <ToastContainer />
        {stage === stages.BEFORE_REGISTRATION && (
          <>
            {/* <Text>{event.title}</Text> */}
            <Text
              pt={"min(100px, 10vh)"}
              textAlign={"center"}
              fontWeight={600}
              fontSize={"32px"}
              pb={"82px"}
            >
              Register to create your AI Twin
            </Text>
            <Flex
              gap={"32px"}
              flexDirection={"column"}
              alignSelf={"center"}
              width={"min(700px, 100%)"}
            >
              <Box>
                <Text fontWeight={"600"}>
                  First name <Star />
                </Text>
                <Input
                  value={user.firstName}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      firstName: e.target.value,
                    });
                  }}
                />
              </Box>
              <Box>
                <Text fontWeight={"600"}>
                  Last name <Star />
                </Text>
                <Input
                  value={user.lastName}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      lastName: e.target.value,
                    });
                  }}
                />
              </Box>
              <Box>
                <Text fontWeight={"600"}>
                  Email <Star />
                </Text>
                <Input
                  value={user.email}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      email: e.target.value,
                    });
                  }}
                />
              </Box>
            </Flex>
            {/* <Box width={"100%"} alignSelf={"center"}> */}
            <Button
              mt={"60px"}
              alignSelf={"center"}
              width={"min(700px, 100%)"}
              disabled={
                user.firstName?.length === 0 ||
                user.lastName?.length === 0 ||
                user.email?.length === 0 ||
                !isEmail(user.email)
              }
              fontWeight={600}
              backgroundColor={"#2770DE"}
              onClick={async () => {
                const response = await fetch("/api/verify", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  body: JSON.stringify({
                    email: user.email ?? "",
                    firstName: user.firstName ?? "",
                    lastName: user.lastName ?? "",
                    event: event.id,
                  }),
                });

                if (response.ok) {
                  const responseParsed = await response.json();
                  setNewID(responseParsed.id);
                  setStage(stages.AFTER_FORM_SUBMITTED);
                }
              }}
              // width={"fit-content"}
            >
              Register
            </Button>
            {/* </Box> */}
          </>
        )}
        {stage === stages.AFTER_FORM_SUBMITTED && (
          <>
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              alignSelf={"center"}
              mt={"auto"}
              mb={"auto"}
              gap={"40px"}
              maxWidth={"700px"}
            >
              <Text textAlign={"center"} fontSize={"32px"} fontWeight={600}>
                Please verify your email to continue
              </Text>
              <Text color={"#7A7578"} textAlign={"center"}>
                We have sent an email to {censoredEmail(user.email)} to verify
                your email address. the link in the email will expire in 24
                hours. Please check your spam folder too.
              </Text>
              <Button
                onClick={() => {
                  window.open(
                    `${window.location.origin}${window.location.pathname}?token=${newID}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                Debug Verify
              </Button>
            </Flex>
          </>
        )}
        {(stage === stages.VERIFIED_AFTER_UNLOCK ||
          stage === stages.VERIFIED_BEFORE_UNLOCK) && (
          <>
            <Text>{event.title}</Text>

            <Text>Hi {user.firstName}!</Text>
            <Text>Prep Instructions</Text>
            <Text>{event.instructions}</Text>
            <Text>Status: Blank</Text>
            {stage === stages.VERIFIED_BEFORE_UNLOCK ? (
              <>
                <Text>Access Denied</Text>
                <Text>
                  Unlocks at {new Date(event.unlockTime).toLocaleString()}
                </Text>
              </>
            ) : (
              <Text>Access Allowed</Text>
            )}
          </>
        )}
        {stage === stages.NO_EVENT_EXISTS && (
          <>
            <Text>No Event Exists With This ID!</Text>
            <Text>Please ensure you have been given the right URL!</Text>
          </>
        )}
      </Flex>
    </Theme>
  );
}
