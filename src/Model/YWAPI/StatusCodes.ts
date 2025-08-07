
export type StatusCode = {
    needRetry: boolean,
    needReturn: boolean,
    description: string
}

export const status_codes = {
    0: {
        needRetry: false,
        needReturn: true,
        description: "Количество попыток превышено",
    } as StatusCode,
    200: {
        needRetry: false,
        needReturn: true,
        description: "Запрос выполнен успешно.",
    } as StatusCode,
    201: {
        needRetry: false,
        needReturn: true,
        description: "В результате выполнения запроса с методом POST успешно создан новый объект.",
    } as StatusCode,
    204: {
        needRetry: false,
        needReturn: true,
        description: "Запрос с методом DELETE успешно выполнен, объект удален.",
    } as StatusCode,
    400: {
        needRetry: true,
        needReturn: false,
        description: "Один или несколько параметров запроса имеют недопустимое значение.",
    } as StatusCode,
    401: {
        needRetry: true,
        needReturn: false,
        description: "Пользователь не авторизован. Проверьте, были ли выполнены действия, описанные в разделе Доступ к API.",
    } as StatusCode,
    403: {
        needRetry: true,
        needReturn: false,
        description: "У вас не хватает прав на выполнение этого действия. Наличие прав можно перепроверить в интерфейсе Трекера — для выполнения действия при помощи API и через интерфейс требуются одинаковые права.",
    } as StatusCode,
    404: {
        needRetry: true,
        needReturn: false,
        description: "Запрошенный объект не был найден. Возможно, вы указали неверное значение идентификатора или ключа объекта.",
    } as StatusCode,
    409: {
        needRetry: true,
        needReturn: false,
        description: "При редактировании объекта возник конфликт. Возможно, ошибка возникла из-за неправильно указанной версии изменений.",
    } as StatusCode,
    412: {
        needRetry: true,
        needReturn: false,
        description: "При редактировании объекта возник конфликт. Возможно, ошибка возникла из-за неправильно указанной версии изменений.",
    } as StatusCode,
    422: {
        needRetry: true,
        needReturn: false,
        description: "Ошибка валидации JSON, запрос отклонен.",
    } as StatusCode,
    423: {
        needRetry: true,
        needReturn: false,
        description: "Редактирование объекта заблокировано. Возможно, превышено допустимое значение параметра version — количество обновлений объекта. Максимальное значение версии составляет 10100 для роботов и 11100 для пользователей.",
    } as StatusCode,
    428: {
        needRetry: true,
        needReturn: false,
        description: "Доступ к ресурсу отклонен. Проверьте, указаны ли все обязательные условия выполнения запроса.",
    } as StatusCode,
    429: {
        needRetry: true,
        needReturn: false,
        description: "Превышено допустимое количество запросов к хосту в единицу времени. Попробуйте повторить запрос позже.",
    } as StatusCode
}