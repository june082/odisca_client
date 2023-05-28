import { useRouter } from "next/router";
import {
  ChangeEvent,
  LiHTMLAttributes,
  OptionHTMLAttributes,
  useEffect,
  useState,
} from "react";
import * as S from "./mapScanner.style";
import { Modal } from "antd";
import { useQueryFetchAllSeatsByStudyCafeId } from "../../../commons/hooks/queries/useQueryFetchAllSeatsByStudyCafeId";
import { useQueryFetchOneStudyCafeForUser } from "../../../commons/hooks/queries/useQueryFetchStudyCafeForUser";
import { ISeat } from "../../../../commons/types/generated/types";
import { useMutationCreatePayment } from "../../../commons/hooks/mutations/useMutationCreatePayment";
import PayModal from "./mapScanner.PayModal";
import { useQueryFetchLoginUser } from "../../../commons/hooks/queries/useQueryFetchLoginUser";
import { wrapAsync } from "../../../../commons/libraries/asyncFunc";
import { v4 as uuidv4 } from "uuid";
import styled from "@emotion/styled";

interface SeatData {
  status: string;
  seatId: string;
  number: string;
  time: number;
}

const BookBtn = styled.button`
  width: 90px;
  height: 35px;
  background-color: #40e0d0;
  border: none;
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  border-radius: 20px;
`;

const CancleBtn = styled.button`
  width: 90px;
  height: 35px;
  background-color: #fff;
  border: 1px solid #40e0d0;
  color: #40e0d0;
  font-weight: 500;
  font-size: 17px;
  border-radius: 20px;
`;

export default function SeatReservationPage(): JSX.Element {
  const [currentValue, setCurrentValue] = useState("1시간");
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();
  const { refetch } = useQueryFetchLoginUser();
  const [open, setOpen] = useState(false);
  const { data: dataCafe } = useQueryFetchOneStudyCafeForUser(
    String(router.query.Id)
  );
  const { data, refetch: refetchSeat } = useQueryFetchAllSeatsByStudyCafeId(
    String(router.query.Id)
  );
  const [, setIsModal] = useState(false);
  const [stateX, setStateX] = useState(
    dataCafe?.fetchOneStudyCafeForUser.studyCafe_floorPlanX ?? 40
  );
  const [stateY, setStateY] = useState(
    dataCafe?.fetchOneStudyCafeForUser.studyCafe_floorPlanY ?? 40
  );
  console.log(dataCafe, "카페");
  const [seatId, setSeatId] = useState("");
  const [seatStatus, setSeatStatus] = useState("");
  const [seatNumber, setSeatNumber] = useState(0);
  const [seatUsable, setSeatUsable] = useState(false);
  const [map, setMap] = useState<SeatData[][]>([]);
  const [duringTime, setDuringTime] = useState(1);
  const [createPayment] = useMutationCreatePayment();
  const [isPayModal, setIsPayModal] = useState(false);
  const [remainTime, setRemainTime] = useState(0);

  useEffect(() => {
    if (dataCafe !== undefined && data !== undefined) {
      setStateX(dataCafe?.fetchOneStudyCafeForUser.studyCafe_floorPlanX);
      setStateY(dataCafe?.fetchOneStudyCafeForUser.studyCafe_floorPlanY);
      const newArray = Array.from(
        Array(dataCafe?.fetchOneStudyCafeForUser.studyCafe_floorPlanY),
        () => {
          const result = [];
          for (
            let i = 0;
            i < dataCafe?.fetchOneStudyCafeForUser.studyCafe_floorPlanX;
            i++
          ) {
            result.push({ status: "empty", seatId: "i", number: "", time: 0 });
          }
          return result;
        }
      );
      data?.fetchAllSeatsByStudyCafeId.forEach((el: ISeat) => {
        const seat = JSON.parse(el.seat_location);

        seat.forEach((ele: number[]) => {
          newArray[ele[1]][ele[0]].status =
            el.user !== undefined ? el.user?.user_id ?? "" : "";
          newArray[ele[1]][ele[0]].seatId = el.seat_id;
          newArray[ele[1]][ele[0]].number = el.seat_number;
          newArray[ele[1]][ele[0]].time = Math.floor(
            (el.seat_remainTime ?? 0) / 60000
          );
        });
      });
      setMap(newArray);
    }
  }, [data, dataCafe, router]);

  const image = (ele: SeatData, x: number, y: number): React.CSSProperties => {
    const result = {
      borderLeft: "none",
      borderRight: "none",
      borderBottom: "none",
      borderTop: "none",
      backgroundColor: "none",
      cursor: "",
    };
    if (y + 1 <= stateY - 1) {
      if (ele.seatId !== map[y + 1][x].seatId) {
        result.borderBottom = "1px solid #fefefe";
      }
    }
    if (x + 1 <= stateX - 1) {
      if (ele.seatId !== map[y][x + 1].seatId) {
        result.borderRight = "1px solid #fefefe";
      }
    }
    if (ele.status === "") {
      result.backgroundColor = "#e4e4e4";
      result.cursor = "pointer";
    }
    if (ele.status !== "empty" && ele.status !== "") {
      result.backgroundColor = "#323232";
      result.cursor = "pointer";
    }
    return result;
  };

  const onClickInfo = (seat: any) => () => {
    if (seat.status === "empty") {
      return;
    }
    if (seat.status === "") {
      setSeatStatus("예약이 가능합니다.");
      setRemainTime(0);
      setSeatUsable(true);
    } else {
      setSeatStatus("예약이 불가능합니다.");
      setRemainTime(seat.time);
    }
    setSeatId(seat.seatId);
    setSeatNumber(seat.number);
    setOpen(true);
  };

  const toggleModal = (): void => {
    setSeatUsable(false);

    setOpen(false);
  };

  const submitReservation = async (): Promise<void> => {
    try {
      await createPayment({
        variables: {
          createPaymentInput: {
            studyCafe_id: String(router.query.Id),
            payment_point:
              duringTime *
              Number(dataCafe?.fetchOneStudyCafeForUser.studyCafe_timeFee),
            payment_time: duringTime,
            seat_id: seatId,
          },
        },
      });
      Modal.success({
        content: "예약에 성공했습니다!",
      });
      await refetch();
      await refetchSeat();
      void router.push("/user/mypage");
    } catch (err) {
      alert("포인트가 부족합니다.");
      setIsModal(false);
      setIsPayModal(true);
    }

    setSeatUsable(false);
    setIsModal(false);
  };

  // const onChangeTime = (event: ChangeEvent<HTMLSelectElement>): void => {
  //   setDuringTime(Number(event.target.value));
  // };

  const onChangeTime = (e: MouseEvent<HTMLLIElement>): void => {
    setCurrentValue(e.currentTarget.getAttribute("value"));
  };

  return (
    <>
      <S.Wrapper>
        <S.SeatsTitle>원하는 좌석을 선택해주세요.</S.SeatsTitle>
        <S.SeatContainer>
          <S.SampleContainer>
            <S.SampleCase>
              <S.SeatSample></S.SeatSample>
              <S.SampleFont>예약 가능 좌석</S.SampleFont>
            </S.SampleCase>
            <S.SampleCase>
              <S.SeatSampleUnUsable></S.SeatSampleUnUsable>
              <S.SampleFont>예약 불가 좌석</S.SampleFont>
            </S.SampleCase>
          </S.SampleContainer>
          <S.Container>
            <S.Box>
              {map.map((el, indY) => {
                return (
                  <S.Box2 key={uuidv4()}>
                    {el.map((ele, indX: number) => {
                      return (
                        <>
                          <S.Pixel
                            key={uuidv4()}
                            style={image(ele, indX, indY)}
                            onClick={onClickInfo(ele)}
                          ></S.Pixel>
                        </>
                      );
                    })}
                  </S.Box2>
                );
              })}
            </S.Box>
          </S.Container>
        </S.SeatContainer>
      </S.Wrapper>

      <S.MenuDrawer
        // open={isModal}
        title="선택 좌석 정보"
        placement="right"
        closable={false}
        open={open}
        width={350}
        footer={[
          <BookBtn
            key={"reservation"}
            onClick={wrapAsync(submitReservation)}
            disabled={!seatUsable}
            style={{
              margin: "27px",
              marginLeft: "60px",
            }}
          >
            예약
          </BookBtn>,
          <CancleBtn key={"cancel"} onClick={toggleModal}>
            취소
          </CancleBtn>,
        ]}
      >
        <div style={{ fontSize: "20px" }}>좌석 번호 : {seatNumber}</div>
        <div style={{ fontSize: "20px" }}>좌석 종류 : {seatStatus}</div>
        {remainTime !== 0 ? (
          <div style={{ fontSize: "16px", color: "#7744AA" }}>
            {String(remainTime) + "분 남았습니다."}
          </div>
        ) : (
          <></>
        )}

        <S.SelectBox
          style={{ width: "300px" }}
          onClick={() => setShowOptions((prev) => !prev)}
        >
          <S.Label>{currentValue}</S.Label>
          <S.SelectOptions show={showOptions} disabled={!seatUsable}>
            <S.Option value="1시간" onClick={onChangeTime}>
              1시간
            </S.Option>
            <S.Option value="2시간" onClick={onChangeTime}>
              2시간
            </S.Option>
            <S.Option value="3시간" onClick={onChangeTime}>
              3시간
            </S.Option>
            <S.Option value="4시간" onClick={onChangeTime}>
              4시간
            </S.Option>
            <S.Option value="5시간" onClick={onChangeTime}>
              5시간
            </S.Option>
          </S.SelectOptions>
        </S.SelectBox>
      </S.MenuDrawer>

      <PayModal
        isPayModal={isPayModal}
        setIsPayModal={setIsPayModal}
      ></PayModal>
    </>
  );
}
