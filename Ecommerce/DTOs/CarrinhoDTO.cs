namespace Ecommerce.DTOs
{
    public class CarrinhoDTO
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public string NomeCliente { get; set; } = string.Empty;
        public List<ItemCarrinhoDTO> Itens { get; set; } = new();
    }
}
