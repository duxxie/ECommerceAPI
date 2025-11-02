namespace Ecommerce.DTOs
{
    public class StatusEntregaDTO
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string Status { get; set; } = "Pendente"; // Pendente, Enviado, Entregue
        public DateTime? DataEnvio { get; set; }
        public DateTime? DataEntrega { get; set; }
    }
}