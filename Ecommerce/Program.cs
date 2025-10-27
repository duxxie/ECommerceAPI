var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseRouting();
app.MapGetRoutes();

app.Run();