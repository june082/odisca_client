import { gql, useQuery, QueryResult } from "@apollo/client";
import {
  IQuery,
  IUser,
  IVisit,
} from "../../../../commons/types/generated/types";

interface IFetchLoginUserQueryResult
  extends Omit<QueryResult<Pick<IQuery, "fetchLoginUser">, IUser>, "refetch"> {
  refetch: () => Promise<void>;
}

export const FETCH_LOGIN_USER = gql`
  query {
    fetchLoginUser {
      user_id
      user_name
      user_email
      user_phone
      user_point
      user_image
      visits {
        visit_id
        visit_createdAt
        studyCafe {
          studyCafe_name
          images {
            image_id
            image_url
            image_isMain
          }
          # seats {
          #   seat_number
          # }
        }
      }
      seat {
        seat_id
        seat_number
        seat_location
        seat_expiredTime
        seat_remainTime
      }
    }
  }
`;

export const useQueryFetchLoginUser = (): IFetchLoginUserQueryResult => {
  const query = useQuery<Pick<IQuery, "fetchLoginUser">, IUser>(
    FETCH_LOGIN_USER
  );
  const refetch = async (): Promise<void> => {
    await query.refetch();
  };

  return { ...query, refetch };
};
