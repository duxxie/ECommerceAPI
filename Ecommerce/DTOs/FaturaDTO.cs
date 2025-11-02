namespace Ecommerce.DTOs
{
    public class FaturaDTO
    {
        public int Id { get; set; }
        public decimal Valor { get; set; }
        public MeioPagamentoDTO? MeioPagamento { get; set; }
        public decimal ValorTotal { get; set; }
    }
}