namespace Ecommerce.DTOs
{
    public class MeioPagamentoDTO
    {
        public int Id { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public string? Descricao { get; set; }
    }
}