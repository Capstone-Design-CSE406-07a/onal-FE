// POST /user/enroll & GET /user/get
export type UserResponse = {
  _id: string;
  id: string;
  password: string;
  name: string;
  onboarding: boolean;
  sensivity: string;
  activity_time: string;
  favorite_place: string[];
  __v: number;
};

export type UserEnrollRequest = {
  id: string;
  password: string;
  name: string;
};

// GET /getdata/pm?lat=&lng= — 현재 위치 미세먼지 단건
export type PmDataResponse = {
  미세먼지: string;
  초미세먼지: string;
  통합대기환경지수: '1' | '2' | '3' | '4'; // 1:좋음 2:보통 3:나쁨 4:매우나쁨
  측정시간: string;
};

// GET /getdata/temperture_wind?lat=&lng= — 현재 위치 기온/풍속 단건
export type TempertureWindResponse = {
  기온: string;
  풍속: string;
  풍향: string;
  습도: string;
  '1시간강수량': string;
  강수형태: string; // 0:없음 1:비 2:비/눈 3:눈 5:빗방울 6:빗방울/눈날림 7:눈날림
};

// GET /getdata/uv?lat=&lng= — 현재 위치 자외선 단건
export type UvDataResponse = {
  uv: number;
};

// GET /getdata/pm/nationwide — 전국 동별 미세먼지 배열
export type PmNationwideItem = PmDataResponse & {
  sido: string;
  sigungu: string;
  dong: string;
};

// GET /getdata/temperture_wind/nationwide — 전국 동별 기온/풍속 배열
export type TempertureWindNationwideItem = TempertureWindResponse & {
  sido: string;
  sigungu: string;
  dong: string;
};

// GET /getdata/uv/nationwide — 전국 동별 자외선 배열
export type UvNationwideItem = UvDataResponse & {
  sido: string;
  sigungu: string;
  dong: string;
};

// GET /getdata/pm/nearby?dong= — 반경 5km 미세먼지 배열
export type NearbyBase = {
  sido: string;
  sigungu: string;
  dong: string;
  areaNo: string;
  distance: number;
};

export type PmNearbyItem = NearbyBase & {
  미세먼지: string;
  초미세먼지: string;
  통합대기환경지수: '1' | '2' | '3' | '4';
  측정시간: string;
};

// GET /getdata/temperture_wind/nearby?dong=
export type TempertureWindNearbyItem = NearbyBase & {
  기온: string;
  풍속: string;
  풍향: string;
  습도: string;
  '1시간강수량': string;
  강수형태: string;
};

// GET /getdata/uv/nearby?dong=
export type UvNearbyItem = NearbyBase & {
  uv: number;
};

export type ApiErrorResponse = {
  message: string;
};
