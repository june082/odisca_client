import styled from "@emotion/styled";

export const Wrapper = styled.main`
  display: flex;
  width: 1920px;
`;

export const SectionLeft = styled.section`
  width: 50%;
  height: 1080px;
  background-color: #40e0d0;
  position: relative;
`;

export const SectionRight = styled.section`
  width: 50%;
  height: 1080px;
  background-color: #4f4f4f;
  position: relative;
`;

export const AdminRegister = styled.div`
  position: absolute;
  bottom: 356px;
  right: 40px;
  cursor: pointer;
  :hover {
    padding-right: 200px;
  }
  transition: 0.5s ease-in-out;
`;

export const AdminFetch = styled.div`
  position: absolute;
  bottom: 270px;
  left: 40px;
  cursor: pointer;
  :hover {
    padding-left: 200px;
  }
  transition: 0.5s ease-in-out;
`;

export const Text1 = styled.h1`
  font-weight: 700;
  font-size: 40px;
  color: #fff;
  margin-bottom: 8px;
`;

export const Text2 = styled.h1`
  font-weight: 700;
  font-size: 40px;
  color: #fff;
  margin-bottom: 8px;
`;

export const ImgBox1 = styled.div``;

export const ImgBox2 = styled.div``;