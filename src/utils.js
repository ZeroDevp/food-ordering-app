import { orderContant } from "./contant";


export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true;
}


export const getbase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const converPrice = (price) => {
    try {
        const result = price?.toLocaleString().replaceAll(",", ".");
        return `${result} VNĐ`;
    } catch (error) {
        return null;
    }
};


export const truncateDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) {
        return description;
    }
    return description.slice(0, maxLength) + "...";
};



export const renderOptions = (arr) => {
    let results = []
    if (arr) {
        results = arr?.map((opt) => {
            return {
                value: opt,
                label: opt
            }
        })
    }
    results.push({
        label: 'Thêm phân loại thức ăn mới',
        value: 'add_type'
    })
    return results
}


export const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
};

export const convertDataChart = (data, type) => {
    try {
        const object = {}
        Array.isArray(data) && data.forEach((opt) => {
            if (!object[opt[type]]) {
                object[opt[type]] = 1
            } else {
                object[opt[type]] += 1
                // console.log('c;getBase64', object[opt[type]], typeof (object[opt[type]]))
            }
        })
        return Array.isArray(Object.keys(object))
            ? Object.keys(object).map((item) => object[item]) // Trả về mảng số liệu
            : [];
    } catch (e) {
        return []
    }
}

export const getLabels = (data, type) => {
    const object = {};
    Array.isArray(data) &&
        data.forEach((opt) => {
            if (!object[opt[type]]) {
                object[opt[type]] = 1;
            } else {
                object[opt[type]] += 1;
            }
        });

    return Array.isArray(Object.keys(object))
        ? Object.keys(object).map((item) => orderContant.payment[item])
        : [];
};