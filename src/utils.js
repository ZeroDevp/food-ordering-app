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