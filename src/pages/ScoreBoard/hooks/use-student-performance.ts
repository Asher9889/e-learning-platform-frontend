// import { useQuery } from "@tanstack/react-query"

// import { getStudentPerformance } from "../api/scoreBoard.api"

// export function useStudentPerformance(
//   params?: {
//     page?: number
//     limit?: number
//     search?: string
//   }
// ) {
//   return useQuery({
//     queryKey: [
//       "student-performance",
//       params,
//     ],

//     queryFn: () =>
//       getStudentPerformance(params),
//   })
// }

import { useInfiniteQuery } from "@tanstack/react-query"

import { getStudentPerformance } from "../api/scoreBoard.api"

export function useStudentPerformance(params?: {
  limit?: number
  search?: string
}) {
  return useInfiniteQuery({
    queryKey: ["student-performance", params],

    queryFn: ({ pageParam }) =>
      getStudentPerformance({
        ...params,
        page: pageParam,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      console.log("lastPage:", lastPage, "allPages count:getNextPageParam", allPages.length)
      const nextPage = allPages?.length + 1
      return nextPage <= lastPage.totalPages ? nextPage : undefined
    },
  })
}