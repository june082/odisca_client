import styled from "@emotion/styled";

const Footer = styled.footer`
  width: 850px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 40px;
`;
const Btn = styled.button`
  width: 130px;
  height: 50px;
  background-color: #ffffff;
  color: #40e0d0;
  border: 1px solid #40e0d0;
  border-radius: 30px;
  margin: 0px 12px;
  cursor: pointer;
  :hover {
    background-color: #40e0d0;
    color: #ffffff;
    border: none;
  }
`;
export default function AdminDetailFooter(): JSX.Element {
  return (
    <Footer>
      <Btn>정보수정</Btn>
      <Btn>배치도 수정</Btn>
      <Btn>취소하기</Btn>
    </Footer>
  );
}
