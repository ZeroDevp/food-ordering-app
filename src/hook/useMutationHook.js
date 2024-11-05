import { useMutation } from "@tanstack/react-query";

export const useMutationHooks = (fnCallBack) => {
    //hàm mutation dùng để call API login user
    const mutation = useMutation({
        mutationFn: fnCallBack
    });
    return mutation
}