import { AppointmentEntity } from "@/domain/appointment/types";
import { ApiResponse } from "../shared/api-response.dto";

export type AppointmentResponseDto = ApiResponse<AppointmentEntity>;
export type AppointmentListResponseDto = ApiResponse<AppointmentEntity[]>;
