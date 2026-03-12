# Estágio de Build
FROM ://mcr.microsoft.com AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Estágio de Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
# O Render usa a porta 10000 por padrão
ENV ASPNETCORE_URLS=http://+:10000 
ENTRYPOINT ["dotnet", "Ecommerce.dll"]