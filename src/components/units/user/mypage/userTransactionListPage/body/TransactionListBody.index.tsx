import CancelPayment from "../../../../../commons/cancelpayment/cancelPayment.index";
import UseModal from "../../../../../commons/hooks/customs/useModal";
import * as S from "./TransactionListBody.styles";

export default function TransactionListBody(): JSX.Element {
  const { showModal, handleOk, handleCancel, isModalOpen } = UseModal();

  return (
    <S.Body>
      <S.Wrapper>
        <S.ReservationWrapper>
          <S.LeftWrapper>
            <S.CafeImg src="/cafeImg.jpeg"></S.CafeImg>
          </S.LeftWrapper>
          <S.RightWrapper>
            <S.Top>
              <S.CafeName>초심스터디카페</S.CafeName>
              <S.SeatInfo>좌석 A16</S.SeatInfo>
              <S.Point>5,000 포인트</S.Point>
              <S.Date>2023.05.17</S.Date>
            </S.Top>
            <S.Bottom>
              <S.Btn onClick={showModal}>결제취소</S.Btn>
            </S.Bottom>
            {isModalOpen ? (
              <S.CancelPaymentModal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
              >
                <CancelPayment handleCancel={handleCancel} />
              </S.CancelPaymentModal>
            ) : (
              <></>
            )}
          </S.RightWrapper>
        </S.ReservationWrapper>
        <S.ReservationWrapper>
          <S.LeftWrapper>
            <S.CafeImg src="/cafeImg.jpeg"></S.CafeImg>
          </S.LeftWrapper>
          <S.RightWrapper>
            <S.Top>
              <S.CafeName>초심스터디카페</S.CafeName>
              <S.SeatInfo>좌석 A16</S.SeatInfo>
              <S.Point>3,000 포인트</S.Point>
              <S.Date>2023.05.17</S.Date>
            </S.Top>
            <S.Bottom>
              <S.Btn>결제취소</S.Btn>
            </S.Bottom>
          </S.RightWrapper>
        </S.ReservationWrapper>
      </S.Wrapper>
    </S.Body>
  );
}