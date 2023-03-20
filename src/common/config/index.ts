export default () => ({
    cos: {
        secretId: '',
        secretKey: '',
        bucket: '',
        region: '',
    },
    server: {
        Order: `${process.env.SERVER_API}/order`,
        Product: `${process.env.SERVER_API}/product`,
        Insure: `${process.env.SERVER_API}/insure`,
    },
});
