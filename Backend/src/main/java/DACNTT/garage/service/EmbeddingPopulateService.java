package DACNTT.garage.service;

import DACNTT.garage.model.ServiceInfo;
import DACNTT.garage.repository.ServiceInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service để tự động generate embeddings cho tất cả records trong database
 * Chạy 1 lần khi khởi động ứng dụng (nếu cần)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmbeddingPopulateService implements CommandLineRunner {

    private final ServiceInfoRepository serviceInfoRepository;
    private final GeminiService geminiService;

    // Set này thành true nếu muốn auto-generate embeddings khi start app
    private static final boolean AUTO_GENERATE_ON_STARTUP = true;

    @Override
    public void run(String... args) throws Exception {
        if (AUTO_GENERATE_ON_STARTUP) {
            log.info("Starting automatic embedding generation...");
            generateAllEmbeddings();
        }
    }

    /**
     * Generate embeddings cho tất cả records chưa có embedding
     */
    public void generateAllEmbeddings() {
        List<ServiceInfo> allRecords = serviceInfoRepository.findAll();

        log.info("Found {} total records", allRecords.size());

        int updated = 0;
        int errors = 0;

        for (ServiceInfo record : allRecords) {
            // Skip nếu đã có embedding
            if (record.getEmbedding() != null && record.getEmbedding().length > 0) {
                continue;
            }

            try {
                // Combine title và content để tạo embedding
                String textToEmbed = buildTextForEmbedding(record);

                // Generate embedding
                float[] embedding = geminiService.generateEmbedding(textToEmbed);

                // Save
                record.setEmbedding(embedding);
                serviceInfoRepository.save(record);

                updated++;
                log.info("Generated embedding for record ID: {} - {}", record.getId(), record.getTitle());

                // Rate limiting: sleep một chút để không quá tải API
                Thread.sleep(500);

            } catch (Exception e) {
                errors++;
                log.error("Error generating embedding for record ID: {}", record.getId(), e);
            }
        }

        log.info("Embedding generation completed. Updated: {}, Errors: {}", updated, errors);
    }

    /**
     * Generate embedding cho một record cụ thể
     */
    public void generateEmbeddingForRecord(Long recordId) {
        ServiceInfo record = serviceInfoRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found: " + recordId));

        String textToEmbed = buildTextForEmbedding(record);
        float[] embedding = geminiService.generateEmbedding(textToEmbed);

        record.setEmbedding(embedding);
        serviceInfoRepository.save(record);

        log.info("Generated embedding for record ID: {}", recordId);
    }

    /**
     * Regenerate tất cả embeddings (force update)
     */
    public void regenerateAllEmbeddings() {
        List<ServiceInfo> allRecords = serviceInfoRepository.findAll();

        log.info("Regenerating embeddings for {} records", allRecords.size());

        int updated = 0;
        for (ServiceInfo record : allRecords) {
            try {
                String textToEmbed = buildTextForEmbedding(record);
                float[] embedding = geminiService.generateEmbedding(textToEmbed);

                record.setEmbedding(embedding);
                serviceInfoRepository.save(record);

                updated++;
                log.info("Regenerated embedding {}/{}", updated, allRecords.size());

                Thread.sleep(500);

            } catch (Exception e) {
                log.error("Error regenerating embedding for record ID: {}", record.getId(), e);
            }
        }

        log.info("Regeneration completed. Updated: {}", updated);
    }

    /**
     * Build text từ record để tạo embedding
     * Ưu tiên: title + category + content
     */
    private String buildTextForEmbedding(ServiceInfo record) {
        StringBuilder sb = new StringBuilder();

        // Title
        if (record.getTitle() != null) {
            sb.append(record.getTitle()).append(". ");
        }

        // Category
        if (record.getCategory() != null) {
            sb.append("Danh mục: ").append(record.getCategory()).append(". ");
        }

        // Description
        if (record.getDescription() != null) {
            sb.append(record.getDescription()).append(". ");
        }

        // Content
        if (record.getContent() != null) {
            sb.append(record.getContent());
        }

        return sb.toString().trim();
    }

    /**
     * Thống kê số lượng records có/chưa có embedding
     */
    public void printEmbeddingStats() {
        List<ServiceInfo> allRecords = serviceInfoRepository.findAll();

        long withEmbedding = allRecords.stream()
                .filter(r -> r.getEmbedding() != null && r.getEmbedding().length > 0)
                .count();

        long withoutEmbedding = allRecords.size() - withEmbedding;

        log.info("=== Embedding Statistics ===");
        log.info("Total records: {}", allRecords.size());
        log.info("With embedding: {}", withEmbedding);
        log.info("Without embedding: {}", withoutEmbedding);
        log.info("Coverage: {:.2f}%", (withEmbedding * 100.0 / allRecords.size()));
    }
}