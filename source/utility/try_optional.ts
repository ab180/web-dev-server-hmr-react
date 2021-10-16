const tryOptional = async <Return>(block: () => Return) => {
    try {
        return await block()
    } catch {
        return undefined
    }
}

export { tryOptional }