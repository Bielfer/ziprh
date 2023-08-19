"use client";
import { ClockIcon } from "@heroicons/react/20/solid";
import { FingerPrintIcon } from "@heroicons/react/24/outline";
import { endOfDay, format, startOfDay } from "date-fns";
import { useMemo, type FC } from "react";
import Button from "~/components/button";
import Container from "~/components/container";
import EmptyState from "~/components/empty-state";
import FeedIcons from "~/components/feed-icons";
import LoadingWrapper from "~/components/loading-wrapper";
import { useToast } from "~/components/toast";
import { tryCatch } from "~/helpers/try-catch";
import { trpc } from "~/services/trpc";

type Props = {
  userId: string;
};

const FeedWrapper: FC<Props> = ({ userId }) => {
  const today = new Date();
  const { addToast } = useToast();
  const { mutateAsync: punchClock, isLoading: isPunchingClock } =
    trpc.clockIns.employeePunch.useMutation();
  const {
    data: clockIns,
    isLoading,
    refetch: refetchClockIns,
  } = trpc.clockIns.getMany.useQuery({
    userId,
    startDate: startOfDay(today),
    endDate: endOfDay(today),
  });

  const formattedClockIns = useMemo(
    () =>
      clockIns?.map((clockIn, idx) => ({
        id: clockIn.id,
        content: `Ponto ${idx + 1} batido`,
        date: format(clockIn.punchTime, "H:mm"),
        icon: FingerPrintIcon,
        iconBackground: "bg-primary-600",
      })) ?? [],
    [clockIns]
  );

  const buttonClick = async () => {
    const [, error] = await tryCatch(punchClock());

    if (error) {
      addToast({
        type: "error",
        content: "Você só pode bater o ponto 5 minutos depois da última vez!",
        duration: 5000,
      });
      return;
    }

    await refetchClockIns();
  };

  return (
    <Container smallerContainer>
      <LoadingWrapper isLoading={isLoading}>
        {formattedClockIns.length > 0 ? (
          <div className="flex flex-col items-center">
            <FeedIcons items={formattedClockIns} className="mb-10 w-full" />
            <Button
              iconLeft={ClockIcon}
              variant="primary"
              onClick={buttonClick}
              loading={isPunchingClock}
            >
              Bater Ponto
            </Button>
          </div>
        ) : (
          <EmptyState
            icon={FingerPrintIcon}
            title="Você ainda não bateu nenhum ponto hoje"
            subtitle="Para bater o ponto basta clicar abaixo"
            buttonOrLink={
              <Button
                iconLeft={ClockIcon}
                variant="primary"
                onClick={buttonClick}
                loading={isPunchingClock}
              >
                Bater Ponto
              </Button>
            }
          />
        )}
      </LoadingWrapper>
    </Container>
  );
};

export default FeedWrapper;
