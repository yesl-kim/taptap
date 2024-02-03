type DateType = Date | string | number

// 잠시 여기 좀 빌리겠습니다...
type SuccessResponse<T> = { success: true; data: T }
type ErrorResponse = { success: false; error: string }
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
