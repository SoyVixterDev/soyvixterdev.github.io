export default 
{
    base: "/soyvixterdev.github.io/", // IMPORTANT: Set this to your GitHub repo name
    resolve: 
    {
        alias: 
        {
            'three': path.resolve('./node_modules/three') // Alias "three" to the correct path
        }
    },
    server: 
    {
        port: 5173,
        open: true,
    }
};