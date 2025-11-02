namespace Ecommerce.DTOs
{
    public class PedidoDTO
    {
        public int Id { get; set; }
        public DateTime DataPedido { get; set; }
        public decimal ValorTotal { get; set; }

        public ClienteDTO? Cliente { get; set; }
        public List<ProdutoDTO> Itens { get; set; } = new();
        public FaturaDTO? Fatura { get; set; }
        public StatusEntregaDTO? StatusEntrega { get; set; }
    }
}